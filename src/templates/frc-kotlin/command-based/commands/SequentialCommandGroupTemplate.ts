export class SequentialCommandGroupTemplate {
    text: string = `package #{PACKAGE}

import edu.wpi.first.wpilibj2.command.SequentialCommandGroup

// NOTE:  Consider using this command inline, rather than writing a subclass.  For more
// information, see:
// https://docs.wpilib.org/en/stable/docs/software/commandbased/convenience-features.html
class #{NAME} : SequentialCommandGroup() {
    /**
     * Creates a new #{NAME}.
     */
    init {
        // Add your commands in the addCommands() call, e.g.
        // addCommands(FooCommand(), BarCommand())
        addCommands()
    }
}
`;
}
