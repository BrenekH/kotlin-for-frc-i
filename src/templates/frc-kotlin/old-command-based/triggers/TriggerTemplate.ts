export class OldCommandTriggerTemplate {
    text: string = `package #{PACKAGE}

import edu.wpi.first.wpilibj.buttons.Trigger

/**
 * Add your docs here.
 */
class #{NAME} : Trigger() {
    override fun get(): Boolean {
        return false
    }
}
`;
}
